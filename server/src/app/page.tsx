import { Frame } from "@/components/Frame";
import { ListMyConnections } from "@/components/ListMyConnections";
import { Button } from "@/components/ui/button";
import { getMyConnections } from "@/lib/connection";
import Link from "next/link";

export default async function Home() {
  const myConnections = await getMyConnections();

  return (
    <Frame
      header={
        <Link href={"/new"}>
          <Button>Add new</Button>
        </Link>
      }
    >
      <ListMyConnections connections={myConnections} />
    </Frame>
  );
}
