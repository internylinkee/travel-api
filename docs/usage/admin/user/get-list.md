# Get list users

Get list info of users

## Infomation

| Protocol | Method | Staging url |
| -------- | ------ | ----------- |
| https    | GET    |             |

## Mandatory HTTP Headers

| Key           | Value                 | Example                                                                                                                                                                             |
| ------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authorization | Bearer <ACCESS_TOKEN> | Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTQ0NjU5MTcsImlhdCI6MTU1NDQ1NjkxNywic3ViIjoiNWNhMzVkYTE0OTdlOGQwMDE3N2Q3MDdlIn0.hdO_96ee0A4IuK8_OQX0qYaSEJoUSK6vSpWJy-DOkfU |

## Option HTTP Parameter

| Key  | Example       | Default | Description         |
| ---- | ------------- | ------- | ------------------- |
| page | 1, 2, 3,...,n | 1       | Index of pagination |

## Response

### Successs

```json
{
  "users": [
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
    },
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
      "isTourGuide": true,
      "tourGuideProfile": {
        "location": {
          "_id": "5cf5ddd2fc13ae78f5000000",
          "name": "Da Nang"
        },
        "reviewCount": 4,
        "rating": 4,
        "certificate": "DH ABC",
        "introduce": "abcasdsdasdas"
      },
      "createdAt": "2019-04-05T10:15:37.794Z",
      "updatedAt": "2019-04-05T10:15:37.794Z"
    }
  ]
}
```

### Error

**Token expired**

```json
{
  "code": 401,
  "message": "jwt expired"
}
```

**No auth token**

```json
{
  "code": 401,
  "message": "No auth token"
}
```
