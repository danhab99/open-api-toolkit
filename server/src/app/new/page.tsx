import { Frame } from "@/components/Frame";
import { ListAvaliableConnections } from "@/components/ListAvaliableConnections";
import { createConnectionsManager } from "@/lib/connection";


export default async function NewPage() {
  const c = await createConnectionsManager(__dirname);
  const mcpDefs = await c.listAvaliableConnections();

  return (
    <Frame>
      <ListAvaliableConnections mcpDefs={mcpDefs} />
    </Frame>
  );
}
