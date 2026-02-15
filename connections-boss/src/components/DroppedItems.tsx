import { Group, Rect, Text } from "react-konva";
import type { DroppedItem } from "../types";

type DroppedItemsProps = {
  items: DroppedItem[];
};

export function DroppedItems({ items }: DroppedItemsProps) {
  return (
    <>
      {items.map((item) => (
        <Group key={item.id} x={item.x} y={item.y}>
          <Rect
            width={30}
            height={10}
            fill="green"
            stroke="white"
            strokeWidth={2}
            offsetX={6}
            offsetY={6}
          />
          <Text
            text={item.type.toUpperCase()}
            fontSize={10}
            fill="black"
            y={15}
            align="center"
            offsetX={25}
            width={100}
          />
        </Group>
      ))}
    </>
  );
}
