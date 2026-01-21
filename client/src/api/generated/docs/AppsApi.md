# AppsApi

All URIs are relative to *http://localhost:5000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create**](#create) | **POST** /api/Apps | |
|[**getAll**](#getall) | **GET** /api/Apps | |
|[**getById**](#getbyid) | **GET** /api/Apps/{id} | |
|[**remove**](#remove) | **DELETE** /api/Apps/{id} | |
|[**replace**](#replace) | **PUT** /api/Apps/{id} | |

# **create**
> AppRecord create(appRecord)


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

const { status, data } = await apiInstance.create(
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

# **getAll**
> Array<AppRecord> getAll()


### Example

```typescript
import {
    AppsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppsApi(configuration);

const { status, data } = await apiInstance.getAll();
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

# **getById**
> AppRecord getById()


### Example

```typescript
import {
    AppsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getById(
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

# **remove**
> remove()


### Example

```typescript
import {
    AppsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.remove(
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

# **replace**
> AppRecord replace(appRecord)


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

const { status, data } = await apiInstance.replace(
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

