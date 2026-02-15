import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import WikiEditorForm from '../WikiEditorForm';

export default async function NewWikiArticlePage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login?callbackUrl=/wiki/new');
  }

  return (
    <WikiEditorForm
      mode="create"
      initial={{
        title: '',
        category: 'Practical',
        summary: '',
        content: '',
        tagsText: '',
        relatedArticlesText: '',
      }}
    />
  );
}
