"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { UserType } from "../data/mockUsers";
import ConfirmModal from "./ConfirmModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Props {
  users: UserType[];
}

function UserTable({ users }: Props) {
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<null | "delete" | "inactive" | "active">(
    null
  );
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`http://localhost:8080/users/api/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // Update user status (inactive or active)
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      axios.patch(`http://localhost:8080/users/api/status/${id}`, {
        status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const toggleMenu = (id: string) => {
    setActionUserId((prev) => (prev === id ? null : id));
  };

  const handleDelete = (id: string) => {
    setModalAction("delete");
    setActionUserId(id);
    setIsModalOpen(true);
  };

  const handleStatusChange = (id: string, status: "inactive" | "active") => {
    setModalAction(status);
    setActionUserId(id);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (actionUserId && modalAction) {
      if (modalAction === "delete") {
        deleteMutation.mutate(actionUserId);
      } else if (modalAction === "inactive" || modalAction === "active") {
        statusMutation.mutate({ id: actionUserId, status: modalAction });
      }
    }
    // Close modal and reset states
    setIsModalOpen(false);
    setModalAction(null);
    setActionUserId(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setModalAction(null);
    setActionUserId(null);
  };

  return (
    <div className="bg-primaryDark p-4 rounded-xl">
      <ConfirmModal
        isModalOpen={isModalOpen}
        message={
          modalAction === "delete"
            ? "Are you sure you want to delete this user?"
            : modalAction === "inactive"
            ? "Are you sure you want to mark user as Inactive?"
            : "Are you sure you want to activate this user?"
        }
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />

      <table className="w-full">
        <thead>
          <tr className="text-gray-400 text-left text-sm">
            <th className="pb-3">Name</th>
            <th className="pb-3">Email</th>
            <th className="pb-3">Role</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Last Login</th>
            <th className="pb-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-[#2b2b2e]/50 relative">
              <td className="flex items-center gap-3 py-4">
                <div className="h-8 w-8 rounded-full bg-purple-700 flex items-center justify-center text-sm font-semibold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                {user.name}
              </td>

              <td>{user.email}</td>

              <td>
                <span className="px-3 py-1 rounded-full text-xs bg-yellow-900/30 text-yellow-400">
                  {user.role}
                </span>
              </td>

              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    user.status === "active"
                      ? "bg-green-900/30 text-green-400"
                      : "bg-red-900/30 text-red-400"
                  }`}
                >
                  {user.status}
                </span>
              </td>

              <td>
                {user.lastLogin
                  ? (() => {
                      const d = new Date(user.lastLogin);
                      const day = d.getDate();
                      const month = d.getMonth() + 1;
                      const year = d.getFullYear();
                      return `${day}-${month}-${year}`;
                    })()
                  : "-"}
              </td>

              <td className="text-right relative">
                <button onClick={() => toggleMenu(user.id)}>
                  <MoreVertical size={18} />
                </button>

                {/* Dropdown Menu */}
                {actionUserId === user.id && (
                  <div className="absolute right-0 mt-2 bg-[#2f2f31] p-2 rounded-lg z-10 min-w-[120px]">
                    <button
                      className="block w-full px-4 py-1 text-sm text-red-400 hover:bg-[#3a3a3d] rounded-md"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                    {user.status === "active" ? (
                      <button
                        className="block w-full px-4 py-1 text-sm text-yellow-400 hover:bg-[#3a3a3d] rounded-md"
                        onClick={() => handleStatusChange(user.id, "inactive")}
                      >
                        Inactive
                      </button>
                    ) : (
                      <button
                        className="block w-full px-4 py-1 text-sm text-green-400 hover:bg-[#3a3a3d] rounded-md"
                        onClick={() => handleStatusChange(user.id, "active")}
                      >
                        Activate
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
