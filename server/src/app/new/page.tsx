import { Frame } from "@/components/Frame";
import { ListAvaliableConnections } from "@/components/ListAvaliableConnections";
import { listAvaliableConnections } from "@/lib/connection";


export default async function NewPage() {
  const mcpDefs = await listAvaliableConnections(__dirname);

  return (
    <Frame>
      <ListAvaliableConnections mcpDefs={mcpDefs} />
    </Frame>
  );
}
