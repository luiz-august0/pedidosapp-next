import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  
  return (
    <div>
      <h2>Ola, {session?.user?.login}</h2>
    </div>
  );
}
