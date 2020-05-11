# candy

Notify your family when you open any new candy bags

## Database specification

```
Messages(_id_, candyType, opener, image, date)
Subscribers(_id_, endpoint, p256dh, auth)
```