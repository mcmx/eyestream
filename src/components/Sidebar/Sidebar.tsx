/**
 * Sidebar Component
 * List of saved readings with add new button
 */

"use client";

import React from "react";
import { useReaderStore } from "@/store/useReaderStore";
import { ReadingItem } from "./ReadingItem";
import { Button } from "../ui/Button";

export function Sidebar() {
  const readings = useReaderStore((state) => state.readings);
  const currentReading = useReaderStore((state) => state.currentReading);
  const sidebarOpen = useReaderStore((state) => state.sidebarOpen);
  const setCurrentReading = useReaderStore((state) => state.setCurrentReading);
  const setAddTextModalOpen = useReaderStore(
    (state) => state.setAddTextModalOpen
  );
  const deleteReading = useReaderStore((state) => state.deleteReading);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reading?")) return;

    try {
      const response = await fetch(`/api/readings/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        deleteReading(id);
      }
    } catch (error) {
      console.error("Error deleting reading:", error);
    }
  };

  const handleSelectReading = async (id: string) => {
    try {
      const response = await fetch(`/api/readings/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentReading(data.reading);
      }
    } catch (error) {
      console.error("Error fetching reading:", error);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() =>
            useReaderStore.getState().setSidebarOpen(false)
          }
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-screen w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                My Library
              </h2>
              <button
                onClick={() =>
                  useReaderStore.getState().toggleSidebar()
                }
                className="lg:hidden text-gray-600 dark:text-gray-400"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <Button
              onClick={() => setAddTextModalOpen(true)}
              className="w-full"
            >
              + Add New Text
            </Button>
          </div>

          {/* Readings list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {readings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No readings yet
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Add your first text to start speed reading
                </p>
              </div>
            ) : (
              readings.map((reading) => (
                <ReadingItem
                  key={reading.id}
                  reading={reading}
                  onClick={() => handleSelectReading(reading.id)}
                  onDelete={() => handleDelete(reading.id)}
                  isActive={currentReading?.id === reading.id}
                />
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
