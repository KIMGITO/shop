<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RiderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            
            'name' => $this->name,
            'phone' => $this->phone,
            'active' => $this->active,
            'creator' => "{$this->creator->first_name}  {$this->creator->last_name}",
            'date' => $this->date,
        ];
    }
}
