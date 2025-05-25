import { ListMyConnections } from "@/components/ListMyConnections";
import { useMyConnections } from "@/hooks/connections";

export default function Home() {
  const myConnections = useMyConnections();

  return (
    <main>
      <ListMyConnections mcps={myConnections} />
    </main>
  );
}
