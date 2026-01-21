# AppsApi

All URIs are relative to *http://localhost:5000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiAppsGet**](#apiappsget) | **GET** /api/Apps | |
|[**apiAppsIdDelete**](#apiappsiddelete) | **DELETE** /api/Apps/{id} | |
|[**apiAppsIdGet**](#apiappsidget) | **GET** /api/Apps/{id} | |
|[**apiAppsIdPatch**](#apiappsidpatch) | **PATCH** /api/Apps/{id} | |
|[**apiAppsIdPut**](#apiappsidput) | **PUT** /api/Apps/{id} | |
|[**apiAppsPost**](#apiappspost) | **POST** /api/Apps | |

# **apiAppsGet**
> Array<AppRecord> apiAppsGet()


### Example

```typescript
import {
    AppsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppsApi(configuration);

const { status, data } = await apiInstance.apiAppsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<AppRecord>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAppsIdDelete**
> apiAppsIdDelete()


### Example

```typescript
import {
    AppsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiAppsIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAppsIdGet**
> AppRecord apiAppsIdGet()


### Example

```typescript
import {
    AppsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiAppsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**AppRecord**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAppsIdPatch**
> AppRecord apiAppsIdPatch(appRecord)


### Example

```typescript
import {
    AppsApi,
    Configuration,
    AppRecord
} from './api';

const configuration = new Configuration();
const apiInstance = new AppsApi(configuration);

let id: number; // (default to undefined)
let appRecord: AppRecord; //

const { status, data } = await apiInstance.apiAppsIdPatch(
    id,
    appRecord
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **appRecord** | **AppRecord**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**AppRecord**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAppsIdPut**
> AppRecord apiAppsIdPut(appRecord)


### Example

```typescript
import {
    AppsApi,
    Configuration,
    AppRecord
} from './api';

const configuration = new Configuration();
const apiInstance = new AppsApi(configuration);

let id: number; // (default to undefined)
let appRecord: AppRecord; //

const { status, data } = await apiInstance.apiAppsIdPut(
    id,
    appRecord
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **appRecord** | **AppRecord**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**AppRecord**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAppsPost**
> AppRecord apiAppsPost(appRecord)


### Example

```typescript
import {
    AppsApi,
    Configuration,
    AppRecord
} from './api';

const configuration = new Configuration();
const apiInstance = new AppsApi(configuration);

let appRecord: AppRecord; //

const { status, data } = await apiInstance.apiAppsPost(
    appRecord
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **appRecord** | **AppRecord**|  | |


### Return type

**AppRecord**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

