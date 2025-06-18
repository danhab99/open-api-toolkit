import { CreateConnection } from "@/components/CreateConnection";
import { Frame } from "@/components/Frame";
import { getMyConnection } from "@/lib/connection";
import { notFound } from "next/navigation";

type PageProps = {
  id: number;
};

export default async function Page({ params }: Promise<PageProps>) {
  const props = await params;
  const connection = await getMyConnection({
    id: parseInt(props.id),
  });

  if (!connection) {
    console.warn("not found");
    notFound();
  }

  return (
    <>
      <Frame title={`edit ${connection.name.toLowerCase()}`}>
        <CreateConnection connection={connection} />
      </Frame>
    </>
  );
}
