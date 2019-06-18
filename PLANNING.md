## To-Do

- [ ] Chrome extension
- [ ] Client-side gallery and lightbox
- [x] Mongoose schema and model
- [ ] Input validation for POST/PUT
- [ ] Basic GET/POST/PUT/DELETE routes
  - [ ] Generate the width/height from the downloaded image
  - [ ] Validate user on PUT/DELETE routes
- [ ] Support for uploading image as multipart data

## Fields

`imageUrl` string (required)
`sourceUrl` string (required)
`description` string (required)
`width` number (generated from image)
`height` number (generated from image)
`author` number (generated from req.user)
`createdAt` timestamp (generated by Mongoose)
`modifedAt` timestamp (generated by Mongoose)

## API

GET /images
Return list of info for all images

GET /images/:id
Return info for just single image

**Below routes require authentication header, POST uses the header to assign the author tag, PUT and DELETE only allow the operation if the user is the correct owner**

POST /images
Send URL for image and let server download it
Returns the created object

PUT /images/:id
Update info for a single image
Can just be a partial update
Returns the updated object

DELETE /images/:id
Delete a single image
Returns the deleted object