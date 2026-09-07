<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\Notification;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupportController extends Controller
{
    public function index()
    {
        $tickets = SupportTicket::with('user')->latest()->get();
        $notifications = Notification::with('sender')->latest()->get();

        return Inertia::render('Admin/Support/Index', [
            'tickets' => $tickets,
            'notifications' => $notifications,
        ]);
    }

    public function updateTicket(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:open,in_progress,resolved,closed',
            'admin_notes' => 'nullable|string',
        ]);

        $ticket = SupportTicket::findOrFail($id);
        $ticket->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
            'resolved_at' => ($request->status === 'resolved' || $request->status === 'closed') ? now() : null,
        ]);

        ActivityLog::log('Update Ticket', 'Support', "Ticket #{$ticket->ticket_number} status updated to {$request->status}");

        return redirect()->back()->with('success', 'Ticket updated successfully.');
    }

    public function sendNotification(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'target_group' => 'required|in:all,vendors,customers',
            'type' => 'required|in:info,warning,urgent',
        ]);

        $validated['sent_by'] = auth()->id();

        $notification = Notification::create($validated);

        ActivityLog::log('Send Notification', 'Notifications', "Broadcast notification sent to {$notification->target_group}");

        return redirect()->back()->with('success', 'Notification broadcasted successfully.');
    }
}
