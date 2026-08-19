import React from "react";
import { BtnPrimary } from "./Shared";
import { Loader2 } from "lucide-react";

interface DeleteConfirmationModalProps {
    title: string;
    subtitle?: string;
    loading?: boolean;
    cancel: () => void;
    confirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    title,
    subtitle,
    loading,
    cancel,
    confirm,
}) => {
    return (
        <div
            className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
        >
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
                <div className="text-center">
                    <h2
                        id="delete-modal-title"
                        className="text-lg font-semibold text-gray-900 sm:text-xl"
                    >
                        {title}
                    </h2>

                    <h2
                        id="delete-modal-title"
                        className="text-md font-semibold text-gray-900 sm:text-xl"
                    >
                        {subtitle}
                    </h2>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={cancel}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 sm:w-auto"
                    >
                        Cancel
                    </button>

                    <BtnPrimary
                        type="button"
                        onClick={confirm}
                        disabled={loading}
                        className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : "Confirm"}
                    </BtnPrimary>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
