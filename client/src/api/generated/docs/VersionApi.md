# VersionApi

All URIs are relative to *http://localhost:5000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getVersion**](#getversion) | **GET** /api/version | |

# **getVersion**
> VersionInfo getVersion()


### Example

```typescript
import {
    VersionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VersionApi(configuration);

const { status, data } = await apiInstance.getVersion();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**VersionInfo**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

