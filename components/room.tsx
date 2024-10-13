// "use client";

// import { ReactNode } from "react";
// import { ClientSideSuspense } from "@liveblocks/react";
// import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";

// import { Layer } from "@/types/canvas";
// import { RoomProvider } from "@/liveblocks.config";

// // import { RoomProvider } from "@liveblocks/react";

// interface RoomProps {
//   children: ReactNode;
//   roomId: string;
//   fallback: NonNullable<React.ReactNode> | null;
// }

// export const Room = ({ children, roomId, fallback }: RoomProps) => {
//   return (
//     <RoomProvider
//       id={roomId}
//       initialPresence={{
//         cursor: null,
//         selection: [],
//         pencilDraft: null,
//         penColor: null,
//       }}
//       initialStorage={{
//         layers: new LiveMap<string, LiveObject<Layer>>(),
//         layerIds: new LiveList<string>(),
//       }}
//     >
//       <ClientSideSuspense fallback={fallback}>
//         {() => children}
//       </ClientSideSuspense>
//     </RoomProvider>
//   );
// };


"use client";

import { LiveMap, LiveList, LiveObject } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import type { ReactNode } from "react";

import { RoomProvider } from "@/liveblocks.config";
import { Layer } from "@/types/canvas";

type RoomProps = {
  children: React.ReactNode;
  roomId: string;
  fallback: NonNullable<ReactNode> | null;
};

export const Room = ({ children, roomId, fallback }: RoomProps) => {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
        selection: [],
        pencilDraft: null,
        penColor: null,
      }}
      initialStorage={{
        layers: new LiveMap<string, LiveObject<Layer>>(),
        layerIds: new LiveList([]),
      }}
    >
      <ClientSideSuspense fallback={fallback}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};