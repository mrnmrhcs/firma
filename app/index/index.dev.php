<?php
include '../vendor/autoload.php';

$kirby = new Kirby([
    'urls' => [
        'index' => 'http://firma.local.run:8080',
        'media' => 'http://firma.local.run:8080/media',
    ],
    'roots' => [
        'index'    => __DIR__,
        'base'     => $base    = dirname(__DIR__),
        'content'  => $base . '/content',
        'site'     => $base . '/site',
        'kirby'    => $base . '/kirby',
        'storage'  => $storage = $base . '/storage',
        'accounts' => $storage . '/accounts',
        'cache'    => $storage . '/cache',
        'sessions' => $storage . '/sessions',
    ]
]);

echo $kirby->render();