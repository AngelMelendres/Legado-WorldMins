import Login from '@/components/Login';
import { Page } from '@/components/PageLayout';

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-center justify-center">
        <Login />
      </Page.Main>
    </Page>
  );
}
