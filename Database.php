<?php
/**
 * Created by PhpStorm.
 * User: Strix
 * Date: 10/15/2019
 * Time: 9:58 PM
 */

class Database extends PDO
{
    private $db = array(
        "host" => 'localhost',
        "user" => 'root',
        "password" => '',
        "db_name" => 'test',
    );
    public $connection;

    public function __construct()
    {
        $option = array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',);
        $db_dsn = 'mysql:host=' . $this->db['host'] . ';dbname=' . $this->db['db_name'] . '';
        try {
            $this->connection = new PDO($db_dsn, $this->db['user'], $this->db['password'], $option);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->connection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        } catch (PDOException $e) {
            echo 'Failed To Connect To Database' . $e->getMessage();
        }
        date_default_timezone_set('Africa/Cairo');
    }

}