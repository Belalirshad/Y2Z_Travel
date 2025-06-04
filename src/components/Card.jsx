import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RiAttachment2, RiDeleteBin6Fill } from "react-icons/ri";
import { ImLocation } from "react-icons/im";
import { FiEdit2 } from "react-icons/fi";
import { restrictToParentElement } from "@dnd-kit/modifiers";

function SortableItem({ item, onLocationClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="p-4 bg-white shadow rounded mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between"
    >
      <div className="flex items-start space-x-4 w-full">
        <img
          src={item.image}
          alt={item.title}
          className="w-full sm:w-28 h-28 object-cover rounded-lg"
        />

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h2 className="text-base sm:text-lg font-semibold text-left">
              {item.title}
            </h2>
            <div className="flex space-x-2 items-center">
              <ImLocation
                onClick={() => onLocationClick(item.coordinates)}
                className="cursor-pointer"
                color="#4DA8DA"
              />
              <RiAttachment2 className="cursor-pointer" />
              <RiDeleteBin6Fill color="#CB0404" className="cursor-pointer" />
            </div>
          </div>

          <div className="text-sm text-gray-400 font-medium text-left mt-2">
            {item.rating} ⭐ {item.review}
          </div>

          <p className="text-sm text-gray-600 bg-gray-100 rounded text-left mt-2 p-1 flex items-center justify-between">
            <span>{item.description}</span>
            <FiEdit2
              className="w-4 h-4 text-gray-500 cursor-pointer ml-2 flex-shrink-0 self-center"
              onClick={() => onEditDescription(item.id)}
            />
          </p>
        </div>
      </div>
    </div>
  );
}

// Main Itinerary List
export default function ItineraryList({ onLocationClick }) {
  const [items, setItems] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    fetch("/mockItinerary.json")
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error fetching itinerary data:", error));
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      setItems((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {items.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              onLocationClick={onLocationClick}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
