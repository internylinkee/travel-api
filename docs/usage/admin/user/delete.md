## Get user by id

Get user throught user id

## Infomation

| Protocol | Method | Staging url |
| -------- | ------ | ----------- |
| https    | GET    |             |

## Mandatory HTTP Headers

| Key           | Value                 | Example                                                                                                                                                                             |
| ------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authorization | Bearer <ACCESS_TOKEN> | Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTQ0NjU5MTcsImlhdCI6MTU1NDQ1NjkxNywic3ViIjoiNWNhMzVkYTE0OTdlOGQwMDE3N2Q3MDdlIn0.hdO_96ee0A4IuK8_OQX0qYaSEJoUSK6vSpWJy-DOkfU |

## Mandatory HTTP Parameters

| Key | Value          | Example                  | Description    |
| --- | -------------- | ------------------------ | -------------- |
| id  | The id of user | 5c814e1b4fda90088e90c438 | The id of user |

## Response

### Success

```json
{
  "_id": "5cf5ddd2fc13ae78f5000000",
  "firstName": "Isidoro",
  "lastName": "Breckwell",
  "email": "ibreckwell0@quantcast.com",
  "avatar": "https://robohash.org/optioinquas.png?size=50x50&set=set1",
  "facebookUrl": "https://www.facebook.com/coders.tokyo",
  "facebookId": "5cf5ddd2fc13ae78f5000001",
  "phone": "863-902-7704",
  "roles": "user",
  "followers": [],
  "isTourGuide": false,
  "createdAt": "2019-04-05T10:15:37.794Z",
  "updatedAt": "2019-04-05T10:15:37.794Z"
}
```
