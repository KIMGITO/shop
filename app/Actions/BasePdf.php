<?php

namespace App\Actions;

class BasePdf
{
    public static function getCachedLogo()
    {
        static $logo = null;
        if ($logo === null) {
            $logoPath = public_path('images/milky.svg');
            if (file_exists($logoPath)) {
                $logo = base64_encode(file_get_contents($logoPath));
            } else {
                $logo = ''; // Fallback if file missing
            }
        }
        return $logo;
    }

    // In your controller
    public static function getConfigSettings()
    {
         $config = null;
        if ($config === null) {
            $config = [
                'phone' => config('custom.phone'),
                'till_number' => config('custom.till_number')
            ];
        }
        return $config;
    }
}