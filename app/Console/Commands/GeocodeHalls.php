<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Hall;
use Illuminate\Support\Facades\Http;

class GeocodeHalls extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'halls:geocode';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Geocode existing halls to assign latitude and longitude';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $halls = Hall::whereNull('latitude')->orWhereNull('longitude')->get();

        if ($halls->isEmpty()) {
            $this->info('All halls are already geocoded.');
            return;
        }

        foreach ($halls as $hall) {
            $addressParts = array_filter([$hall->address, $hall->area, $hall->city, 'India']);
            $address = implode(', ', $addressParts);
            
            $this->info("Geocoding {$hall->name} ($address)...");

            try {
                // Using Nominatim API (OpenStreetMap)
                $response = Http::withHeaders([
                    'User-Agent' => 'LuxeHalls App / ' . config('app.url')
                ])->get('https://nominatim.openstreetmap.org/search', [
                    'q' => $address,
                    'format' => 'json',
                    'limit' => 1
                ]);

                if ($response->successful() && !empty($response->json())) {
                    $result = $response->json()[0];
                    $hall->update([
                        'latitude' => $result['lat'],
                        'longitude' => $result['lon']
                    ]);
                    $this->info("Success: [{$result['lat']}, {$result['lon']}]");
                } else {
                    $this->error("Failed to geocode.");
                }
                
                // Be nice to the public API
                sleep(1);
            } catch (\Exception $e) {
                $this->error("Exception: " . $e->getMessage());
            }
        }
        
        $this->info("Geocoding complete!");
    }
}
