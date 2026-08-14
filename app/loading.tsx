// app/loading.tsx
export default function Loading() {
    return (
        <div className="animate-pulse space-y-4 p-4 md:p-6">
            <div className="h-6 w-40 rounded bg-gray-200" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="h-24 rounded-2xl bg-gray-200" />
                <div className="h-24 rounded-2xl bg-gray-200" />
                <div className="h-24 rounded-2xl bg-gray-200" />
            </div>
            <div className="h-64 rounded-2xl bg-gray-200" />
            <div className="h-32 rounded-2xl bg-gray-200" />
        </div>
    );
}