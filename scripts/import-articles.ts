import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { WikiArticle } from '../src/types';

// ES modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMPORTS_DIR = path.resolve(__dirname, '../imports');
const PROCESSED_DIR = path.resolve(__dirname, '../imports/processed');

// Env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function importArticles() {
    console.log(`Scanning ${IMPORTS_DIR} for .json files...`);

    if (!fs.existsSync(IMPORTS_DIR)) {
        console.error(`Directory not found: ${IMPORTS_DIR}`);
        return;
    }

    if (!fs.existsSync(PROCESSED_DIR)) {
        fs.mkdirSync(PROCESSED_DIR, { recursive: true });
    }

    const files = fs.readdirSync(IMPORTS_DIR).filter(file => file.endsWith('.json'));

    if (files.length === 0) {
        console.log('No .json files found to import.');
        return;
    }

    for (const file of files) {
        const filePath = path.join(IMPORTS_DIR, file);
        console.log(`Processing ${file}...`);

        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const articles: WikiArticle[] = JSON.parse(fileContent);

            if (!Array.isArray(articles)) {
                console.error(`  Error: ${file} is not an array of articles.`);
                continue;
            }

            const rows = articles.map((a) => ({
                slug: a.slug,
                title: a.title,
                category: a.category,
                summary: a.summary,
                infobox: a.infobox ?? null,
                content: a.content,
                related_articles: a.relatedArticles,
                tags: a.tags,
                last_updated: a.lastUpdated,
            }));

            const { error } = await supabase.from('wiki_articles').upsert(rows, { onConflict: 'slug' });

            if (error) {
                console.error(`  Supabase Error for ${file}:`, error.message);
            } else {
                console.log(`  Success: Upserted ${rows.length} articles from ${file}.`);

                // Move to processed
                const destPath = path.join(PROCESSED_DIR, file);
                fs.renameSync(filePath, destPath);
                console.log(`  Moved ${file} to imports/processed/`);
            }

        } catch (err) {
            console.error(`  Failed to process ${file}:`, err);
        }
    }
}

importArticles();
