<?php

namespace App\Services;

use Typesense\Client;

class TypesenseService
{
    protected Client $client;

    public function __construct()
    {
        $this->client = new Client([
            'api_key' => env('TYPESENSE_API_KEY'),
            'nodes' => [
                [
                    'host' => env('TYPESENSE_HOST'),
                    'port' => '443',
                    'protocol' => 'https',
                ]
            ],
            'connection_timeout_seconds' => 2,
        ]);
    }

    public function createCollectionFromJson(string $jsonPath)
    {
        $schema = json_decode(file_get_contents($jsonPath), true);

        if (!$schema || !isset($schema['name'])) {
            throw new \Exception("Invalid schema JSON at {$jsonPath}");
        }

        try {
            $this->client->collections->create($schema);
        } catch (\Typesense\Exceptions\ObjectAlreadyExists $e) {
            // Already exists, ignore
        }
    }
    public function deleteCollection(string $name): void
    {
        try {
            $this->client->collections[$name]->delete();
        } catch (\Typesense\Exceptions\ObjectNotFound $e) {
            // Collection does not exist, ignore
        }
    }

    /* ----------------------------- */
    /* PROTOCOLS */
    /* ----------------------------- */
    public function upsertProtocol(array $payload)
    {
        return $this->client
            ->collections['protocols']
            ->documents
            ->upsert($payload);
    }

    public function deleteProtocol(string|int $id)
    {
        return $this->client
            ->collections['protocols']
            ->documents[$id]
            ->delete();
    }



    public function searchProtocols(array $params)
    {
        return $this->client
            ->collections['protocols']
            ->documents
            ->search([
                'q' => $params['q'] ?? '*',
                'query_by' => 'title,tags',
                'sort_by' => $params['sort_by'] ?? 'created_at:desc',
                'per_page' => $params['per_page'] ?? 14,
                'page' => $params['page'] ?? 1,
                'filter_by' => $params['filter_by'] ?? '',
            ]);
    }

    /* ----------------------------- */
    /* THREADS */
    /* ----------------------------- */
    public function upsertThread(array $payload)
    {
        return $this->client
            ->collections['threads']
            ->documents
            ->upsert($payload);
    }

    public function deleteThread(string|int $id)
    {
        return $this->client
            ->collections['threads']
            ->documents[$id]
            ->delete();
    }

    public function searchThreads(array $params)
    {
        return $this->client
            ->collections['threads']
            ->documents
            ->search([
                'q' => $params['q'] ?? '*',
                'query_by' => 'title,body,tags',
                'sort_by' => $params['sort_by'] ?? 'created_at:desc',
                'per_page' => $params['per_page'] ?? 14,
                'page' => $params['page'] ?? 1,
                'filter_by' => $params['filter_by'] ?? '',
            ]);
    }
}