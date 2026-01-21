"use server";
import {
  getAllConnections,
  getTools,
  importConnection,
} from "@/lib/connection";
import { Frame } from "@/components/Frame";
import { CreateConnection } from "@/components/CreateConnection";

type PageProps = {
  params: Promise<{
    connectionName: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const props = await params;
  const connection = await importConnection(props.connectionName);
  const tools = await getTools(connection.id);

  return (
    <Frame title={`create ${connection.displayName.toLowerCase()} connection`}>
      <hr />
      <h1 className="text-2xl py-2">
        {connection.displayName} ({connection.id})
      </h1>
      <p className="text-gray-500 pb-4 lg:pb-4 pb-0">
        {connection.userDescription}
      </p>
      <div className="flex flex-row gap-4">
        <div className="w-3/5">
          <CreateConnection connectionDef={connection} />
        </div>
        <div className="w-2/5 flex flex-col h-full bottom-0">
          <h3 className="text-xl pl-4 pb-4 flex-shrink-0">Tools</h3>
          <div className="overflow-y-auto overflow-x-hidden scrollbar-hide pl-4 pr-4 max-h-[calc(100vh-15rem)]">
            {tools.map((tool, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-lg p-4 shadow my-4 overflow-x-hidden"
              >
                <h6 className="text-gray-500 leading-none overflow-none text-ellipsis align-middle pb-2">
                  {tool.displayName}{" "}
                  <span className="text-xs pb-2 text-gray-600">
                    ({tool.id})
                  </span>
                </h6>
                <p className="text-xs pb-3">{tool.userDescription}</p>
                {tool.arguments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Arguments:
                    </p>
                    <div className="overflow-x-hidden">
                      <table className="w-full text-xs border-collapse border border-gray-300 table-fixed">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700 w-[30%]">
                              Name
                            </th>
                            <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700 w-[20%]">
                              Type
                            </th>
                            <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700 w-[50%]">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {tool.arguments.map((arg, j) => (
                            <tr key={j} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-2 py-1.5 font-mono text-gray-800 truncate">
                                {arg.id}
                              </td>
                              <td className="border border-gray-300 px-2 py-1.5 text-gray-600 truncate">
                                {arg.type}
                              </td>
                              <td className="border border-gray-300 px-2 py-1.5 text-gray-600 break-words">
                                {arg.displayName}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

export async function generateStaticParams() {
  const c = await getAllConnections();
  return c.map((slug) => ({ slug }));
}
