import { Frame } from "@/components/Frame";
import { ListMyConnections } from "@/components/ListMyConnections";
import { Button } from "@/components/ui/button";
import { createConnectionsManager } from "@/lib/connection";
import Link from "next/link";

export default async function Home() {
  const c = await createConnectionsManager(__dirname);
  const myConnections = await c.getMyConnections();

  return (
    <Frame
      header={
        <Link href={"/new"}>
          <Button>Add new</Button>
        </Link>
      }
    >
      <ListMyConnections mcps={myConnections} />
    </Frame>
  );
}
