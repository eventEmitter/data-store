
    drop schema if exists data_store cascade;
    create schema data_store;

    set search_path to data_store;



    create table "dataSet" (
          "id"              serial
        , "identifier"      varchar(100) not null
        , "created"         timestamp without time zone default now() not null
        , "updated"         timestamp without time zone default now() not null
        , "deleted"         timestamp without time zone
        , constraint "dataSet_pk"
            primary key("id")
        , constraint "dataSet_unique_identifier"
            unique("identifier")
    );




    create table "document" (
          "id"              serial
        , "document"        json not null
        , "dataSet_id"      int not null
        , "created"         timestamp without time zone default now() not null
        , "updated"         timestamp without time zone default now() not null
        , "deleted"         timestamp without time zone
        , constraint "document_pk"
            primary key("id")
        , constraint "document_fk_dataSet"
            foreign key ("dataSet_id")
            references "dataSet"("id")
            on update cascade
            on delete restrict 
    );