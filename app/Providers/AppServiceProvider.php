<?php

namespace App\Providers;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        if (config('app.env') === 'production' || env('RENDER') || env('VERCEL') || request()->header('X-Forwarded-Proto') === 'https') {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        $this->ensureDatabaseReady();
    }

    /**
     * Ensure database sqlite file exists and migrations are run on cloud environments.
     */
    private function ensureDatabaseReady(): void
    {
        if (env('DB_CONNECTION') !== 'sqlite') {
            return;
        }

        $database = env('DB_DATABASE', database_path('database.sqlite'));
        if (! is_string($database) || $database === '' || $database === ':memory:') {
            return;
        }

        $directory = dirname($database);
        if (! is_dir($directory)) {
            @mkdir($directory, 0755, true);
        }

        if (! file_exists($database)) {
            @touch($database);
        }

        try {
            if (! Schema::hasTable('users')) {
                Artisan::call('migrate', ['--force' => true]);
                Artisan::call('db:seed', ['--force' => true]);
            }
        } catch (\Throwable) {
            // Silently swallow initial setup race conditions
        }
    }
}
