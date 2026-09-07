<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\VendorController as AdminVendorController;
use App\Http\Controllers\Admin\HallController as AdminHallController;
use App\Http\Controllers\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Admin\SubscriptionController as AdminSubscriptionController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Admin\OfferController as AdminOfferController;
use App\Http\Controllers\Admin\SupportController as AdminSupportController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\VendorDashboardController;
use App\Http\Controllers\VendorHallController;
use App\Http\Controllers\VendorAvailabilityController;
use App\Http\Controllers\VendorBookingController;
use App\Http\Controllers\VendorCustomerController;
use App\Http\Controllers\VendorFinanceController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\CustomerHallController;
use App\Http\Controllers\CustomerBookingController;
use App\Http\Controllers\CustomerFavouriteController;
use App\Http\Controllers\CustomerDashboardController;
use App\Http\Controllers\OfferController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/halls', [CustomerHallController::class, 'index'])->name('halls.index');
Route::get('/halls/{id}', [CustomerHallController::class, 'show'])->name('halls.show');
Route::get('/offers', [OfferController::class, 'index'])->name('offers.index');

// Convenience Redirects for Base URLs
Route::redirect('/admin', '/admin/dashboard');
Route::redirect('/vendor', '/vendor/dashboard');
Route::redirect('/customer', '/customer/dashboard');

// Public / Authenticated Booking Flow
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Customer Booking Actions
    Route::get('/halls/{id}/book', [CustomerBookingController::class, 'create'])->name('halls.book');
    Route::post('/halls/{id}/checkout', [CustomerBookingController::class, 'checkout'])->name('halls.checkout');
    Route::post('/halls/{id}/pay', [CustomerBookingController::class, 'processPayment'])->name('halls.pay');
    Route::post('/favourites/{hallId}/toggle', [CustomerFavouriteController::class, 'toggle'])->name('favourites.toggle');
});

// --- ADMIN PANEL ---
Route::middleware(['auth', 'role:Admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::post('/vendor/{id}/approve', [AdminController::class, 'approveVendor'])->name('vendor.approve');
    Route::post('/hall/{id}/approve', [AdminController::class, 'approveHall'])->name('hall.approve');

    // Vendor Management
    Route::get('/vendors', [AdminVendorController::class, 'index'])->name('vendors.index');
    Route::get('/vendors/{id}', [AdminVendorController::class, 'show'])->name('vendors.show');
    Route::post('/vendors/{id}/approve', [AdminVendorController::class, 'approve'])->name('vendors.approve');
    Route::post('/vendors/{id}/suspend', [AdminVendorController::class, 'suspend'])->name('vendors.suspend');
    Route::post('/vendors/{id}/activate', [AdminVendorController::class, 'activate'])->name('vendors.activate');

    // Hall Verification & Management
    Route::get('/halls', [AdminHallController::class, 'index'])->name('halls.index');
    Route::get('/halls/{id}/review', [AdminHallController::class, 'review'])->name('halls.review');
    Route::post('/halls/{id}/approve', [AdminHallController::class, 'approve'])->name('halls.approve');
    Route::post('/halls/{id}/request-changes', [AdminHallController::class, 'requestChanges'])->name('halls.request-changes');
    Route::post('/halls/{id}/reject', [AdminHallController::class, 'reject'])->name('halls.reject');

    // Booking Ledger
    Route::get('/bookings', [AdminBookingController::class, 'index'])->name('bookings.index');
    Route::post('/bookings/{id}/cancel', [AdminBookingController::class, 'cancel'])->name('bookings.cancel');

    // Customer Directory
    Route::get('/customers', [AdminCustomerController::class, 'index'])->name('customers.index');
    Route::post('/customers/{id}/toggle-status', [AdminCustomerController::class, 'toggleStatus'])->name('customers.toggle-status');

    // Subscriptions & Plans
    Route::get('/subscriptions', [AdminSubscriptionController::class, 'index'])->name('subscriptions.index');
    Route::post('/plans', [AdminSubscriptionController::class, 'storePlan'])->name('plans.store');
    Route::put('/plans/{id}', [AdminSubscriptionController::class, 'updatePlan'])->name('plans.update');

    // Payments & Refunds
    Route::get('/payments', [AdminPaymentController::class, 'index'])->name('payments.index');
    Route::post('/refunds/{id}/process', [AdminPaymentController::class, 'processRefund'])->name('refunds.process');

    // Reviews Moderation
    Route::get('/reviews', [AdminReviewController::class, 'index'])->name('reviews.index');
    Route::post('/reviews/{id}/status', [AdminReviewController::class, 'updateStatus'])->name('reviews.status');
    Route::delete('/reviews/{id}', [AdminReviewController::class, 'destroy'])->name('reviews.destroy');

    // Offers & Promos
    Route::get('/offers', [AdminOfferController::class, 'index'])->name('offers.index');
    Route::post('/offers', [AdminOfferController::class, 'store'])->name('offers.store');
    Route::post('/offers/{id}/toggle', [AdminOfferController::class, 'toggleStatus'])->name('offers.toggle');
    Route::delete('/offers/{id}', [AdminOfferController::class, 'destroy'])->name('offers.destroy');

    // Support & Broadcast Notifications
    Route::get('/support', [AdminSupportController::class, 'index'])->name('support.index');
    Route::post('/support/{id}', [AdminSupportController::class, 'updateTicket'])->name('support.update');
    Route::post('/notifications/send', [AdminSupportController::class, 'sendNotification'])->name('notifications.send');

    // Analytics & Audit Trail Reports
    Route::get('/reports', [AdminReportController::class, 'index'])->name('reports.index');
});

// --- VENDOR PANEL ---
Route::middleware(['auth', 'role:Vendor'])->prefix('vendor')->name('vendor.')->group(function () {
    Route::get('/dashboard', [VendorDashboardController::class, 'index'])->name('dashboard');

    // Subscription
    Route::get('/subscription/choose', [SubscriptionController::class, 'choose'])->name('subscription.choose');
    Route::post('/subscription/process', [SubscriptionController::class, 'processDummyPayment'])->name('subscription.process');
    
    // Hall Management
    Route::get('/halls', [VendorHallController::class, 'index'])->name('halls.index');
    Route::get('/halls/create', [VendorHallController::class, 'create'])->name('halls.create');
    Route::post('/halls', [VendorHallController::class, 'store'])->name('halls.store');
    Route::get('/halls/{id}/edit', [VendorHallController::class, 'edit'])->name('halls.edit');
    Route::put('/halls/{id}', [VendorHallController::class, 'update'])->name('halls.update');
    Route::delete('/halls/{id}', [VendorHallController::class, 'destroy'])->name('halls.destroy');
    Route::get('/halls/{id}/preview', [VendorHallController::class, 'preview'])->name('halls.preview');
    Route::post('/halls/custom-amenity', [VendorHallController::class, 'storeCustomAmenity'])->name('halls.custom-amenity');

    // Availability Calendar
    Route::get('/availability', [VendorAvailabilityController::class, 'index'])->name('availability.index');
    Route::post('/availability/block', [VendorAvailabilityController::class, 'block'])->name('availability.block');
    Route::post('/availability/unblock', [VendorAvailabilityController::class, 'unblock'])->name('availability.unblock');

    // Bookings
    Route::get('/bookings', [VendorBookingController::class, 'index'])->name('bookings.index');
    Route::post('/bookings/offline', [VendorBookingController::class, 'storeOffline'])->name('bookings.offline');
    Route::post('/bookings/{id}/status', [VendorBookingController::class, 'updateStatus'])->name('bookings.status');

    // Customers
    Route::get('/customers', [VendorCustomerController::class, 'index'])->name('customers.index');

    // Finance & Revenue
    Route::get('/finance', [VendorFinanceController::class, 'index'])->name('finance.index');
});

// --- CUSTOMER PANEL ---
Route::middleware(['auth', 'role:Customer'])->prefix('customer')->name('customer.')->group(function () {
    Route::get('/dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');
    Route::get('/bookings', [CustomerBookingController::class, 'index'])->name('bookings.index');
    Route::get('/bookings/{id}', [CustomerBookingController::class, 'show'])->name('bookings.show');
    Route::post('/bookings/{id}/cancel', [CustomerBookingController::class, 'cancel'])->name('bookings.cancel');
    Route::get('/bookings/{id}/invoice', [CustomerBookingController::class, 'invoice'])->name('bookings.invoice');
    Route::get('/favourites', [CustomerFavouriteController::class, 'index'])->name('favourites.index');
    Route::post('/halls/{id}/reviews', [CustomerDashboardController::class, 'storeReview'])->name('halls.reviews.store');
});

require __DIR__.'/auth.php';
