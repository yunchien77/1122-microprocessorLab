#include <iostream>
#include <cstdio>

using namespace std;

int main(int argc, char *argv[]) {
    char buffer[100] = { 0 };
    FILE *fp = fopen("/dev/demo", "w+");

    if (fp != NULL) {
        if (argc == 3) {
            snprintf(buffer, sizeof(buffer), "%s %c", argv[2], argv[1][3]);
            fwrite(buffer, sizeof(buffer), 1, fp);
        } else if (argc == 2) {
            snprintf(buffer, sizeof(buffer), "get %c", argv[1][3]);
        } else {
            cout << "Error: number of arg\n";
            cout << "number of arg: " << argc << endl;
        }
        
        fwrite(buffer, sizeof(buffer), 1, fp);
    } else {
         cout << "Error: Failed to open file\n";
         return 0;
    }

    fread(buffer, sizeof(buffer), 1, fp);
    fclose(fp);
    return 0;
}