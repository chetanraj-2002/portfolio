-- Add gallery_images column to media_gallery table for multiple image support
ALTER TABLE media_gallery 
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add gallery_images column to portfolio_projects table for multiple image support
ALTER TABLE portfolio_projects 
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add comment for documentation
COMMENT ON COLUMN media_gallery.gallery_images IS 'Array of image URLs for slideshow/gallery display';
COMMENT ON COLUMN portfolio_projects.gallery_images IS 'Array of image URLs for slideshow/gallery display';