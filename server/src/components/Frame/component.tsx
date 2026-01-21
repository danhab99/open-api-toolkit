import Link from "next/link";
import React from "react";

export type FrameProps = {
  header?: React.ReactNode;
  title?: string;
};

export function Frame(props: React.PropsWithChildren<FrameProps>) {
  return (
    <>
      <main className="px-20 pt-8">
        <div className="flex flex-row gap-8">
          <h1 className="text-4xl">
            <Link href="/">OpenAPI Connector</Link>
            {props.title ? ` - ${props.title}` : ""}
          </h1>
          {props.header}
        </div>

        <div className="pt-8 pb-0">{props.children}</div>
      </main>
    </>
  );
}
