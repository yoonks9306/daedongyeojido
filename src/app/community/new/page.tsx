import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import NewCommunityPostForm from './NewCommunityPostForm';

export default async function NewCommunityPostPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/community/new');
  }

  return <NewCommunityPostForm />;
}
