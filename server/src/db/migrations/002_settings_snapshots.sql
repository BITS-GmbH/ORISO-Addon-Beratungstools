CREATE TABLE settings_snapshots (
	tenant_id BIGINT NOT NULL,
	agency_id BIGINT NOT NULL DEFAULT 0,
	value JSON NOT NULL,
	updated_at DATETIME(3) NOT NULL,
	PRIMARY KEY (tenant_id, agency_id)
);
