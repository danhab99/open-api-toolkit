import { Frame } from "@/components/Frame";
import { ListAvaliableConnections } from "@/components/ListAvaliableConnections";

export default async function NewPage() {
  return (
    <Frame>
      <ListAvaliableConnections />
    </Frame>
  );
}
