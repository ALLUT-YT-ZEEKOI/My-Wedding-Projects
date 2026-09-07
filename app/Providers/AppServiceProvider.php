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

        $this->ensureVercelRuntime();
    }

    /**
     * Vercel lambdas only have a writable /tmp disk.
     */
    private function ensureVercelRuntime(): void
    {
        if (! env('VERCEL')) {
            return;
        }

        $viewPath = env('VIEW_COMPILED_PATH', '/tmp/views');
        if (! is_dir($viewPath)) {
            @mkdir($viewPath, 0755, true);
        }

        if (env('DB_CONNECTION') !== 'sqlite') {
            return;
        }

        $database = env('DB_DATABASE', '/tmp/database.sqlite');
        if (! is_string($database) || $database === '') {
            return;
        }

        $directory = dirname($database);
        if (! is_dir($directory)) {
            @mkdir($directory, 0755, true);
        }

        if (! file_exists($database)) {
            touch($database);
        }

        try {
            if (! Schema::hasTable('users')) {
                Artisan::call('migrate', ['--force' => true]);
                Artisan::call('db:seed', ['--force' => true]);
            }
        } catch (\Throwable) {
            // First request may race a cold start; the next request will retry.
        }
    }
}
