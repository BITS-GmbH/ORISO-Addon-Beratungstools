CREATE TABLE releases (
	tenant_id BIGINT NOT NULL,
	asker_id VARCHAR(80) NOT NULL,
	tool VARCHAR(40) NOT NULL,
	released_by VARCHAR(80) NOT NULL,
	released_at DATETIME(3) NOT NULL,
	withdrawn_at DATETIME(3) NULL,
	opened_at DATETIME(3) NULL,
	PRIMARY KEY (tenant_id, asker_id, tool),
	KEY releases_asker (asker_id),
	KEY releases_by (released_by)
);

CREATE TABLE shares (
	tenant_id BIGINT NOT NULL,
	asker_id VARCHAR(80) NOT NULL,
	tool VARCHAR(40) NOT NULL,
	shared TINYINT(1) NOT NULL,
	shared_since DATETIME(3) NULL,
	changed_at DATETIME(3) NOT NULL,
	PRIMARY KEY (tenant_id, asker_id, tool),
	KEY shares_asker (asker_id)
);

CREATE TABLE entries (
	id CHAR(36) NOT NULL,
	tenant_id BIGINT NOT NULL,
	owner_id VARCHAR(80) NOT NULL,
	tool VARCHAR(40) NOT NULL,
	kind VARCHAR(40) NOT NULL,
	entry_key VARCHAR(64) NULL,
	day DATE NULL,
	data JSON NOT NULL,
	created_at DATETIME(3) NOT NULL,
	updated_at DATETIME(3) NOT NULL,
	PRIMARY KEY (id),
	UNIQUE KEY entries_keyed (tenant_id, owner_id, tool, kind, entry_key),
	KEY entries_owner_tool (tenant_id, owner_id, tool, day),
	KEY entries_owner (owner_id)
);

CREATE TABLE seen (
	tenant_id BIGINT NOT NULL,
	counsellor_id VARCHAR(80) NOT NULL,
	asker_id VARCHAR(80) NOT NULL,
	tool VARCHAR(40) NOT NULL,
	seen_at DATETIME(3) NOT NULL,
	PRIMARY KEY (tenant_id, counsellor_id, asker_id, tool),
	KEY seen_asker (asker_id)
);

CREATE TABLE notification_prefs (
	counsellor_id VARCHAR(80) NOT NULL,
	first_share TINYINT(1) NOT NULL,
	new_entry TINYINT(1) NOT NULL,
	changed_entry TINYINT(1) NOT NULL,
	updated_at DATETIME(3) NOT NULL,
	PRIMARY KEY (counsellor_id)
);

CREATE TABLE notification_outbox (
	tenant_id BIGINT NOT NULL,
	asker_id VARCHAR(80) NOT NULL,
	tool VARCHAR(40) NOT NULL,
	pending TINYINT UNSIGNED NOT NULL,
	version INT UNSIGNED NOT NULL,
	due_at DATETIME(3) NULL,
	last_sent_at DATETIME(3) NULL,
	claim_id CHAR(36) NULL,
	claimed_at DATETIME(3) NULL,
	PRIMARY KEY (tenant_id, asker_id, tool),
	KEY outbox_due (due_at)
);
