<?php


function db(){
    try{
    return new PDO('mysql:host=' . $_ENV['DB_HOST'] . ';dbname=' . $_ENV['DB_NAME'],
    $_ENV['DB_USER'], $_ENV['DB_PASS'], [
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    }catch(PDOException){
        die('Erro ao tentar conectar ao banco');
    }
}