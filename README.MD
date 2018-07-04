# Audio Transcoder which use λ and S3

## Prerequiste
 - Add static ffmpeg binaries to /ffmpeg/

## Supported codecs
- opus
- flac

## Expected Incoming Data
```
{
   "definitions": {}, 
   "$schema": "http://json-schema.org/draft-07/schema#", 
   "properties": {
     "in": {
       "$id": "/properties/in", 
       "type": "object", 
       "properties": {
         "bucket": {
           "$id": "/properties/in/properties/bucket", 
           "type": "string", 
           "title": "The Bucket Schema ", 
           "default": "", 
           "examples": [
             "speech2text"
           ]
         }, 
         "key": {
           "$id": "/properties/in/properties/key", 
           "type": "string", 
           "title": "The Key Schema ", 
           "default": "", 
           "examples": [
             "gcp/in/uuid.ogg"
           ]
         }
       }
     }, 
     "out": {
       "$id": "/properties/out", 
       "type": "object", 
       "properties": {
         "bucket": {
           "$id": "/properties/out/properties/bucket", 
           "type": "string", 
           "title": "The Bucket Schema ", 
           "default": "", 
           "examples": [
             "speech2text"
           ]
         }, 
         "key": {
           "$id": "/properties/out/properties/key", 
           "type": "string", 
           "title": "The Key Schema ", 
           "default": "", 
           "examples": [
             "gcp/out/uuid"
           ]
         }, 
         "codec": {
           "$id": "/properties/out/properties/codec", 
           "type": "string", 
           "title": "The Codec Schema ", 
           "default": "", 
           "examples": [
             "opus"
           ]
         }
       }
     }
   }
 }
```