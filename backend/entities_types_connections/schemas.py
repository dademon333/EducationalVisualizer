from pydantic import BaseModel


class ConnectionNotFoundResponse(BaseModel):
    detail: str = 'Connection not found'


class ConnectionAlreadyExistsResponse(BaseModel):
    detail: str = 'Connection already exists'


class ConnectionCreatesCycleErrorResponse(BaseModel):
    detail: str = 'This connection creates connections cycle'
