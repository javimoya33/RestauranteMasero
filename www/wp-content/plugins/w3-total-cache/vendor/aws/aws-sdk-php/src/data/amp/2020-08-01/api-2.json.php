<?php
// This file was auto-generated from sdk-root/src/data/amp/2020-08-01/api-2.json
return [ 'version' => '2.0', 'metadata' => [ 'apiVersion' => '2020-08-01', 'endpointPrefix' => 'aps', 'jsonVersion' => '1.1', 'protocol' => 'rest-json', 'serviceFullName' => 'Amazon Prometheus Service', 'serviceId' => 'amp', 'signatureVersion' => 'v4', 'signingName' => 'aps', 'uid' => 'amp-2020-08-01', ], 'operations' => [ 'CreateWorkspace' => [ 'name' => 'CreateWorkspace', 'http' => [ 'method' => 'POST', 'requestUri' => '/workspaces', 'responseCode' => 202, ], 'input' => [ 'shape' => 'CreateWorkspaceRequest', ], 'output' => [ 'shape' => 'CreateWorkspaceResponse', ], 'errors' => [ [ 'shape' => 'ThrottlingException', ], [ 'shape' => 'ConflictException', ], [ 'shape' => 'ValidationException', ], [ 'shape' => 'AccessDeniedException', ], [ 'shape' => 'InternalServerException', ], [ 'shape' => 'ServiceQuotaExceededException', ], ], 'idempotent' => true, ], 'DeleteWorkspace' => [ 'name' => 'DeleteWorkspace', 'http' => [ 'method' => 'DELETE', 'requestUri' => '/workspaces/{workspaceId}', 'responseCode' => 202, ], 'input' => [ 'shape' => 'DeleteWorkspaceRequest', ], 'errors' => [ [ 'shape' => 'ThrottlingException', ], [ 'shape' => 'ValidationException', ], [ 'shape' => 'ResourceNotFoundException', ], [ 'shape' => 'AccessDeniedException', ], [ 'shape' => 'InternalServerException', ], ], 'idempotent' => true, ], 'DescribeWorkspace' => [ 'name' => 'DescribeWorkspace', 'http' => [ 'method' => 'GET', 'requestUri' => '/workspaces/{workspaceId}', 'responseCode' => 200, ], 'input' => [ 'shape' => 'DescribeWorkspaceRequest', ], 'output' => [ 'shape' => 'DescribeWorkspaceResponse', ], 'errors' => [ [ 'shape' => 'ThrottlingException', ], [ 'shape' => 'ValidationException', ], [ 'shape' => 'ResourceNotFoundException', ], [ 'shape' => 'AccessDeniedException', ], [ 'shape' => 'InternalServerException', ], ], ], 'ListWorkspaces' => [ 'name' => 'ListWorkspaces', 'http' => [ 'method' => 'GET', 'requestUri' => '/workspaces', 'responseCode' => 200, ], 'input' => [ 'shape' => 'ListWorkspacesRequest', ], 'output' => [ 'shape' => 'ListWorkspacesResponse', ], 'errors' => [ [ 'shape' => 'ThrottlingException', ], [ 'shape' => 'ValidationException', ], [ 'shape' => 'AccessDeniedException', ], [ 'shape' => 'InternalServerException', ], ], ], 'UpdateWorkspaceAlias' => [ 'name' => 'UpdateWorkspaceAlias', 'http' => [ 'method' => 'POST', 'requestUri' => '/workspaces/{workspaceId}/alias', 'responseCode' => 204, ], 'input' => [ 'shape' => 'UpdateWorkspaceAliasRequest', ], 'errors' => [ [ 'shape' => 'ThrottlingException', ], [ 'shape' => 'ConflictException', ], [ 'shape' => 'ValidationException', ], [ 'shape' => 'ResourceNotFoundException', ], [ 'shape' => 'AccessDeniedException', ], [ 'shape' => 'InternalServerException', ], [ 'shape' => 'ServiceQuotaExceededException', ], ], 'idempotent' => true, ], ], 'shapes' => [ 'AccessDeniedException' => [ 'type' => 'structure', 'required' => [ 'message', ], 'members' => [ 'message' => [ 'shape' => 'String', ], ], 'error' => [ 'httpStatusCode' => 403, 'senderFault' => true, ], 'exception' => true, ], 'ConflictException' => [ 'type' => 'structure', 'required' => [ 'message', 'resourceId', 'resourceType', ], 'members' => [ 'message' => [ 'shape' => 'String', ], 'resourceId' => [ 'shape' => 'String', ], 'resourceType' => [ 'shape' => 'String', ], ], 'error' => [ 'httpStatusCode' => 409, 'senderFault' => true, ], 'exception' => true, ], 'CreateWorkspaceRequest' => [ 'type' => 'structure', 'members' => [ 'alias' => [ 'shape' => 'WorkspaceAlias', ], 'clientToken' => [ 'shape' => 'IdempotencyToken', 'idempotencyToken' => true, ], ], ], 'CreateWorkspaceResponse' => [ 'type' => 'structure', 'required' => [ 'arn', 'status', 'workspaceId', ], 'members' => [ 'arn' => [ 'shape' => 'WorkspaceArn', ], 'status' => [ 'shape' => 'WorkspaceStatus', ], 'workspaceId' => [ 'shape' => 'WorkspaceId', ], ], ], 'DeleteWorkspaceRequest' => [ 'type' => 'structure', 'required' => [ 'workspaceId', ], 'members' => [ 'clientToken' => [ 'shape' => 'IdempotencyToken', 'idempotencyToken' => true, 'location' => 'querystring', 'locationName' => 'clientToken', ], 'workspaceId' => [ 'shape' => 'WorkspaceId', 'location' => 'uri', 'locationName' => 'workspaceId', ], ], ], 'DescribeWorkspaceRequest' => [ 'type' => 'structure', 'required' => [ 'workspaceId', ], 'members' => [ 'workspaceId' => [ 'shape' => 'WorkspaceId', 'location' => 'uri', 'locationName' => 'workspaceId', ], ], ], 'DescribeWorkspaceResponse' => [ 'type' => 'structure', 'required' => [ 'workspace', ], 'members' => [ 'workspace' => [ 'shape' => 'WorkspaceDescription', ], ], ], 'IdempotencyToken' => [ 'type' => 'string', 'max' => 64, 'min' => 1, 'pattern' => '[!-~]+', ], 'Integer' => [ 'type' => 'integer', 'box' => true, ], 'InternalServerException' => [ 'type' => 'structure', 'required' => [ 'message', ], 'members' => [ 'message' => [ 'shape' => 'String', ], 'retryAfterSeconds' => [ 'shape' => 'Integer', 'location' => 'header', 'locationName' => 'Retry-After', ], ], 'error' => [ 'httpStatusCode' => 500, ], 'exception' => true, 'fault' => true, 'retryable' => [ 'throttling' => false, ], ], 'ListWorkspacesRequest' => [ 'type' => 'structure', 'members' => [ 'alias' => [ 'shape' => 'WorkspaceAlias', 'location' => 'querystring', 'locationName' => 'alias', ], 'maxResults' => [ 'shape' => 'ListWorkspacesRequestMaxResultsInteger', 'location' => 'querystring', 'locationName' => 'maxResults', ], 'nextToken' => [ 'shape' => 'PaginationToken', 'location' => 'querystring', 'locationName' => 'nextToken', ], ], ], 'ListWorkspacesRequestMaxResultsInteger' => [ 'type' => 'integer', 'box' => true, 'max' => 1000, 'min' => 1, ], 'ListWorkspacesResponse' => [ 'type' => 'structure', 'required' => [ 'workspaces', ], 'members' => [ 'nextToken' => [ 'shape' => 'PaginationToken', ], 'workspaces' => [ 'shape' => 'WorkspaceSummaryList', ], ], ], 'PaginationToken' => [ 'type' => 'string', ], 'ResourceNotFoundException' => [ 'type' => 'structure', 'required' => [ 'message', 'resourceId', 'resourceType', ], 'members' => [ 'message' => [ 'shape' => 'String', ], 'resourceId' => [ 'shape' => 'String', ], 'resourceType' => [ 'shape' => 'String', ], ], 'error' => [ 'httpStatusCode' => 404, 'senderFault' => true, ], 'exception' => true, ], 'ServiceQuotaExceededException' => [ 'type' => 'structure', 'required' => [ 'message', 'quotaCode', 'resourceId', 'resourceType', 'serviceCode', ], 'members' => [ 'message' => [ 'shape' => 'String', ], 'quotaCode' => [ 'shape' => 'String', ], 'resourceId' => [ 'shape' => 'String', ], 'resourceType' => [ 'shape' => 'String', ], 'serviceCode' => [ 'shape' => 'String', ], ], 'error' => [ 'httpStatusCode' => 402, 'senderFault' => true, ], 'exception' => true, ], 'String' => [ 'type' => 'string', ], 'ThrottlingException' => [ 'type' => 'structure', 'required' => [ 'message', ], 'members' => [ 'message' => [ 'shape' => 'String', ], 'quotaCode' => [ 'shape' => 'String', ], 'retryAfterSeconds' => [ 'shape' => 'Integer', 'location' => 'header', 'locationName' => 'Retry-After', ], 'serviceCode' => [ 'shape' => 'String', ], ], 'error' => [ 'httpStatusCode' => 429, 'senderFault' => true, ], 'exception' => true, 'retryable' => [ 'throttling' => false, ], ], 'Timestamp' => [ 'type' => 'timestamp', ], 'UpdateWorkspaceAliasRequest' => [ 'type' => 'structure', 'required' => [ 'workspaceId', ], 'members' => [ 'alias' => [ 'shape' => 'WorkspaceAlias', ], 'clientToken' => [ 'shape' => 'IdempotencyToken', 'idempotencyToken' => true, ], 'workspaceId' => [ 'shape' => 'WorkspaceId', 'location' => 'uri', 'locationName' => 'workspaceId', ], ], ], 'Uri' => [ 'type' => 'string', 'max' => 1024, 'min' => 1, ], 'ValidationException' => [ 'type' => 'structure', 'required' => [ 'message', 'reason', ], 'members' => [ 'fieldList' => [ 'shape' => 'ValidationExceptionFieldList', ], 'message' => [ 'shape' => 'String', ], 'reason' => [ 'shape' => 'ValidationExceptionReason', ], ], 'error' => [ 'httpStatusCode' => 400, 'senderFault' => true, ], 'exception' => true, ], 'ValidationExceptionField' => [ 'type' => 'structure', 'required' => [ 'message', 'name', ], 'members' => [ 'message' => [ 'shape' => 'String', ], 'name' => [ 'shape' => 'String', ], ], ], 'ValidationExceptionFieldList' => [ 'type' => 'list', 'member' => [ 'shape' => 'ValidationExceptionField', ], ], 'ValidationExceptionReason' => [ 'type' => 'string', 'enum' => [ 'UNKNOWN_OPERATION', 'CANNOT_PARSE', 'FIELD_VALIDATION_FAILED', 'OTHER', ], ], 'WorkspaceAlias' => [ 'type' => 'string', 'max' => 100, 'min' => 1, ], 'WorkspaceArn' => [ 'type' => 'string', ], 'WorkspaceDescription' => [ 'type' => 'structure', 'required' => [ 'arn', 'createdAt', 'status', 'workspaceId', ], 'members' => [ 'alias' => [ 'shape' => 'WorkspaceAlias', ], 'arn' => [ 'shape' => 'WorkspaceArn', ], 'createdAt' => [ 'shape' => 'Timestamp', ], 'prometheusEndpoint' => [ 'shape' => 'Uri', ], 'status' => [ 'shape' => 'WorkspaceStatus', ], 'workspaceId' => [ 'shape' => 'WorkspaceId', ], ], ], 'WorkspaceId' => [ 'type' => 'string', 'max' => 64, 'min' => 1, 'pattern' => '[0-9A-Za-z][-.0-9A-Z_a-z]*', ], 'WorkspaceStatus' => [ 'type' => 'structure', 'required' => [ 'statusCode', ], 'members' => [ 'statusCode' => [ 'shape' => 'WorkspaceStatusCode', ], ], ], 'WorkspaceStatusCode' => [ 'type' => 'string', 'enum' => [ 'CREATING', 'ACTIVE', 'UPDATING', 'DELETING', 'CREATION_FAILED', ], ], 'WorkspaceSummary' => [ 'type' => 'structure', 'required' => [ 'arn', 'createdAt', 'status', 'workspaceId', ], 'members' => [ 'alias' => [ 'shape' => 'WorkspaceAlias', ], 'arn' => [ 'shape' => 'WorkspaceArn', ], 'createdAt' => [ 'shape' => 'Timestamp', ], 'status' => [ 'shape' => 'WorkspaceStatus', ], 'workspaceId' => [ 'shape' => 'WorkspaceId', ], ], ], 'WorkspaceSummaryList' => [ 'type' => 'list', 'member' => [ 'shape' => 'WorkspaceSummary', ], ], ],];