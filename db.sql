CREATE TABLE feeds (
    feed_id uuid NOT NULL,
    candidate_name character varying(50),
    tasks_remaining integer NOT NULL,
    total_tasks integer NOT NULL
)