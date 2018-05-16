# λ which transcode stereo opus to mono opus via S3

## Prerequiste
 - Add static ffmpeg binaries to /ffmpeg/

### Optional
- zip as cli tool installed (for build.sh)

## Expected Incoming Data
```
{
 2   "$id": "http://example.com/example.json", 
 3   "type": "object", 
 4   "definitions": {}, 
 5   "$schema": "http://json-schema.org/draft-07/schema#", 
 6   "properties": {
 7     "in": {
 8       "$id": "/properties/in", 
 9       "type": "object", 
10       "properties": {
11         "bucket": {
12           "$id": "/properties/in/properties/bucket", 
13           "type": "string", 
14           "title": "The Bucket Schema ", 
15           "default": "", 
16           "examples": [
17             "speech2text"
18           ]
19         }, 
20         "key": {
21           "$id": "/properties/in/properties/key", 
22           "type": "string", 
23           "title": "The Key Schema ", 
24           "default": "", 
25           "examples": [
26             "gcp/in/uuid.ogg"
27           ]
28         }
29       }
30     }, 
31     "out": {
32       "$id": "/properties/out", 
33       "type": "object", 
34       "properties": {
35         "bucket": {
36           "$id": "/properties/out/properties/bucket", 
37           "type": "string", 
38           "title": "The Bucket Schema ", 
39           "default": "", 
40           "examples": [
41             "speech2text"
42           ]
43         }, 
44         "key": {
45           "$id": "/properties/out/properties/key", 
46           "type": "string", 
47           "title": "The Key Schema ", 
48           "default": "", 
49           "examples": [
50             "gcp/out/uuid"
51           ]
52         }, 
53         "codec": {
54           "$id": "/properties/out/properties/codec", 
55           "type": "string", 
56           "title": "The Codec Schema ", 
57           "default": "", 
58           "examples": [
59             "opus"
60           ]
61         }
62       }
63     }
64   }
65 }
```