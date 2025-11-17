use mdbook::book::{Book, BookItem};
use mdbook::errors::Error;
use mdbook::preprocess::{Preprocessor, PreprocessorContext};
use regex::Regex;
use std::io;

struct Superscript;

impl Preprocessor for Superscript {
    fn name(&self) -> &str {
        "superscript"
    }

    fn run(&self, _ctx: &PreprocessorContext, mut book: Book) -> Result<Book, Error> {
        let re = Regex::new(r"\^(\d+|\#)\^").unwrap();

        book.for_each_mut(move |item| {
            if let BookItem::Chapter(chapter) = item {
                chapter.content = re.replace_all(&chapter.content, |caps: &regex::Captures| {
                    format!("<sup>{}</sup>", &caps[1])
                }).to_string();
            }
        });

        Ok(book)
    }
}

fn main() -> Result<(), Error> {
    let (ctx, book) = mdbook::preprocess::CmdPreprocessor::parse_input(io::stdin())?;
    let preprocessor = Superscript;
    let processed_book = preprocessor.run(&ctx, book)?;
    serde_json::to_writer(io::stdout(), &processed_book)?;
    Ok(())
}
