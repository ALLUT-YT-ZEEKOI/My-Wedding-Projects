<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureVendorIsApproved
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->hasRole('Vendor')) {
            $profile = $user->vendorProfile;
            
            if (!$profile || $profile->verification_status !== 'approved') {
                return redirect()->route('vendor.pending');
            }
        }

        return $next($request);
    }
}
