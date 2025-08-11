import { CreateConnection } from "@/components/CreateConnection";
import { Frame } from "@/components/Frame";
import { getMyConnection } from "@/lib/connection";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: number;
  }>
};

export default async function Page({ params }: PageProps) {
  const props = await params;
  const connection = await getMyConnection({
    id: parseInt(props.id as any),
  });

  if (!connection) {
    console.warn("not found");
    notFound();
  }

  return (
    <>
      <Frame title={`edit ${connection.displayName.toLowerCase()}`}>
        <CreateConnection connection={connection} />
      </Frame>
    </>
  );
}
