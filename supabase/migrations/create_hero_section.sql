-- Table for English hero section
CREATE TABLE zirospace_hero_en (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    background_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Polish hero section
CREATE TABLE zirospace_hero_pl (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    background_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to both tables
CREATE TRIGGER update_zirospace_hero_en_modtime 
BEFORE UPDATE ON zirospace_hero_en 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_zirospace_hero_pl_modtime 
BEFORE UPDATE ON zirospace_hero_pl 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();



-- Example insert for English
INSERT INTO zirospace_hero_en (title, subtitle, background_image)
VALUES ('Pioneering Integrated Digital Health Solutions', 'Designing User-Friendly Technology for Better Patient Experiences, from Apps to Devices', null);

-- Example insert for Polish
INSERT INTO zirospace_hero_pl (title, subtitle, background_image)
VALUES ('Tworzymy marki z troską', 'Partnerstwo dla Twojego sukcesu poprzez design', null);
