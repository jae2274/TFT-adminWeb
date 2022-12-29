package com.tft.apibatch.mongo

import com.mongodb.*
import com.mongodb.connection.ConnectionPoolSettings
import com.mongodb.connection.SocketSettings
import java.util.concurrent.TimeUnit

//@Configuration
interface MongoConfig {
    fun mongoClientSettings(uri: String, poolSettings: Block<ConnectionPoolSettings.Builder>): MongoClientSettings {
        val connectionString = ConnectionString(uri)
        return MongoClientSettings.builder()
            .retryReads(false)
            .retryWrites(false)
            .writeConcern(WriteConcern.ACKNOWLEDGED)
            .readPreference(ReadPreference.secondaryPreferred())
            .applyConnectionString(connectionString)
            .applyToConnectionPoolSettings(poolSettings!!)
            .applyToSocketSettings { x: SocketSettings.Builder ->
                x.connectTimeout(3, TimeUnit.SECONDS)
                x.readTimeout(2, TimeUnit.SECONDS)
            }
            .build()
    }

    fun mongoClientSettings(
        uri: String?,
        userName: String?,
        dbname: String?,
        password: String,
        poolSettings: Block<ConnectionPoolSettings.Builder?>?
    ): MongoClientSettings? {
        val connectionString = ConnectionString(uri!!)
        return MongoClientSettings.builder()
            .credential(MongoCredential.createCredential(userName!!, dbname!!, password.toCharArray()))
            .retryReads(false)
            .retryWrites(false)
            .writeConcern(WriteConcern.ACKNOWLEDGED)
            .readPreference(ReadPreference.secondaryPreferred())
            .applyConnectionString(connectionString)
            .applyToConnectionPoolSettings(poolSettings!!)
            .applyToSocketSettings { x: SocketSettings.Builder ->
                x.connectTimeout(3, TimeUnit.SECONDS)
                x.readTimeout(2, TimeUnit.SECONDS)
            }
            .build()
    }

    fun generalPoolSettings(): Block<ConnectionPoolSettings.Builder> {
        return Block { x: ConnectionPoolSettings.Builder ->
            x.maxSize(50)
            x.maxWaitTime(3, TimeUnit.SECONDS)
        }
    }
}