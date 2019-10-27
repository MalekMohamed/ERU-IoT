<?php

/**
 * Created by PhpStorm.
 * User: Strix
 * Date: 10/15/2019
 * Time: 5:52 PM
 */
require 'Database.php';

Class Events extends Database
{
    private $request;
    private $_Event;

    public function __construct()
    {
        parent::__construct();
        $this->request = isset($_POST['request']) ? $_POST['request'] : '';
        $this->_Event = isset($_POST['event']) ? $_POST['event'] : '';
        if (isset($this->request)) {
            switch ($this->request) {
                case 'getEvents':
                    $this->getEvent();
                    break;
                case 'getEvent':
                    $this->getEvent($_POST['event_name']);
                    break;
                case 'PublishEvent':
                    if (isset($this->_Event)) {
                        $this->PublishEvent($this->_Event);
                    }
                    break;
                    case 'reset':
                    $this->reset();
                    break;
            }
        }
    }

    private function PublishEvent($Event)
    {
        $data = array(
            'name' => $Event['name'],
            'data' => $Event['data']
        );
        $payload = json_encode($data);
        // Prepare new cURL resource
        $ch = curl_init('https://api.wia.io/v1/events');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLINFO_HEADER_OUT, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
// Set HTTP Header for POST request
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Authorization: Bearer d_sk_Ngqut2ETd5fYrBfHFQlHstJm',
                'Content-Type: application/json',
                'Content-Length: ' . strlen($payload))
        );
// Submit the POST request
        $result = curl_exec($ch);
// Close cURL session handle
        curl_close($ch);
        $data['id'] = $result;
        $this->PushEvent($data);
        echo $result;

    }

    public function getEvent($name = null)
    {
        if ($name == 'logs') {
            $query = $this->connection->prepare("SELECT * FROM events WHERE id IN (SELECT MAX(id) FROM events GROUP BY event_name)");
            $query->execute();
            return json_encode($query->fetchAll());
        }
        elseif ($name != null) {
            $query = $this->connection->prepare("SELECT * FROM events WHERE event_name = ? ORDER BY id DESC");
            $query->execute(array($name));
            echo json_encode($query->fetch());
        } 
        else {
            $query = $this->connection->prepare("SELECT * FROM events WHERE id IN (SELECT MAX(id) FROM events GROUP BY event_name)");
            $query->execute();
            echo json_encode($query->fetchAll());
        }
    }

    public function PushEvent($Event)
    {
        $query = $this->connection->prepare("INSERT INTO events (event_id,event_name,event_data) VALUES (:id,:name,:data)");
        $query->execute(array(
            'id' => $Event['id'],
            'name' => $Event['name'],
            'data' => $Event['data'],
        ));
    }
    private function reset() {
        $query = $this->connection->prepare("DELETE FROM events WHERE event_name != 'Incoming-From-Sensors'");
            $query->execute();
            echo 'success';
    }
}

$Events = new Events();
if (isset($_GET['wia']) && isset($_REQUEST['Data'])) {
    $event['data'] = $_REQUEST['Data'];
    $event['name'] = $_REQUEST['Event_Name'];
    $event['id'] = $_REQUEST['Event_ID'];
    $Events->PushEvent($event);
}
?>
